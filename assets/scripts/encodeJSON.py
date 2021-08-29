from os import sep
import sys
from typing import List
import json
import argparse
import re

parser=argparse.ArgumentParser(
    description='''
	Convert file to JSON. 
	Code must begin with #BEGIN_CODE and end with #END_CODE.
	Solution must begin with #BEGIN_SOLUTION and end with #END_SOLUTION. Code blocks must be enclosed in <inline>...</inline> or <block>...</block> tags.
	Tags section must begin with #BEGIN_TAGS and end with #END_TAGS. Individual tags must be separated by ; or , ''',)

parser.add_argument('file',help='input text file path')
parser.add_argument('-w', '--write', help='file path for output (overwrites)')
parser.add_argument('-a','--append', help='file path to append to (updates file if it exists)')
parser.add_argument('-v', '--verbose', help='prettify json', action='store_true')
args=parser.parse_args()

def escapeHTML(string):
	chars = {'&' : '&amp;', '<' : '&lt;','>' : '&gt;','"' : '&quot;',"'" : '&#39;'}
	for k, v in chars.items():
		string = string.replace(k, v)

	return string

if __name__ == '__main__':
	try:
		with open(args.file) as f:
			text = f.read()

			try:
				problem = re.search('#BEGIN_PROBLEM(.*)#END_PROBLEM', text, flags=re.S).group(1).strip()
			except AttributeError as e:
				ans = input('WARNING: Missing problem. Continue? (y/n)')
				if ans == 'n':
					sys.exit()
				problem = ''

			try:
				solution = re.search('#BEGIN_SOLUTION(.*)#END_SOLUTION', text, flags=re.S).group(1).strip()
			except AttributeError as e:
				ans = input('WARNING: Missing solution. Continue? (y/n)')
				if ans == 'n':
					sys.exit()
				solution = ''

			try:
				tags = [tag.strip() for tag in re.split('[,;]',re.search('#BEGIN_TAGS(.*)#END_TAGS', text, flags=re.S).group(1).strip())]
				if 'correct' not in tags and 'incorrect' not in tags:
					raise Exception('ERROR: Missing correct/incorrect tag')
			except AttributeError as e:
				ans = input('WARNING: Missing tags. Continue? (y/n)')
				if ans == 'n':
					sys.exit()
				tags = []


			solution = re.sub(
				'<inline>(.*?)</inline>',
				lambda m: f"<pre class='inline'><code>{escapeHTML(m.group(1).strip())}</code></pre>",
				solution, flags=re.S)

			solution = re.sub(
				'<block>(.*?)</block>',
				lambda m: f"<pre><code>{escapeHTML(m.group(1).strip())}</code></pre>",
				solution, flags=re.S)

			solution = '<span>' + solution + '</span>'

			if args.write or args.append:
				if args.write:
					with open(args.write, 'w') as jsonFile:
						jsonFile.write(json.dumps({
								'content': [ {'id' : 1, 'problem' : problem, 'solution' : solution, 'tags' : tags} ]
							}, 
						indent=4 if args.verbose else None ))
				else:
					with open(args.append, 'r') as jsonFile:
						jsonFileData = json.loads(jsonFile.read())
						
						lastId = None
						if 'content' in jsonFileData:
							if isinstance(jsonFileData['content'], List):
								if 'id' in jsonFileData['content'][-1]:
									lastId = jsonFileData['content'][-1]['id']

						if lastId is None:
							jsonFileData = { 'content': [ {'id' : 1, 'problem' : problem, 'solution' : solution, 'tags' : tags} ] }
						else:
							jsonFileData['content'].append({'id' : lastId+1, 'problem' : problem, 'solution' : solution, 'tags' : tags})

					with open(args.append, 'w') as jsonFile:
						jsonFile.write(json.dumps(jsonFileData, indent=4 if args.verbose else None ))
			else:
				print(json.dumps({'content': [
					{'id' : 1, 'problem' : problem, 'solution' : solution, 'tags' : tags},
				]}, indent= 4 if args.verbose else None ))

	except Exception as e:
		print(e)
		