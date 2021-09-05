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
group = parser.add_mutually_exclusive_group()

parser.add_argument('-v', '--verbose', help='prettify json', action='store_true')

group.add_argument('-w', '--write', nargs=2, metavar=('problemFile', 'outputFile'), help='write problem from problemFile to outputFile (overwrites all)')
group.add_argument('-a', '--append',nargs=2, metavar=('problemFile', 'outputFile'), help='write problem from problemFile to outputFile (appends to end)')
group.add_argument('-i','--insert', nargs=3, metavar=('problemFile', 'outputFile', 'problem_id'), help='write problem from problemFile to outputFile (inserts before problem with id problem_id)')
group.add_argument('-rp','--replace', nargs=3, metavar=('problemFile', 'outputFile', 'problem_id'), help='write problem from problemFile to outputFile overwriting problem with id problem_id')
group.add_argument('-r', '--remove', nargs=2, metavar=('JSONFile, problem_id'), help='removes problem with problem_id from JSONFile')

args=parser.parse_args()

def escapeHTML(string):
	chars = {'&' : '&amp;', '<' : '&lt;','>' : '&gt;','"' : '&quot;',"'" : '&#39;'}
	for k, v in chars.items():
		string = string.replace(k, v)

	return string

def getProblem(file):
	with open(file, 'r') as f:
		text = f.read()

		try:
			problem = re.search('#BEGIN_PROBLEM(.*)#END_PROBLEM', text, flags=re.S).group(1).strip()
			if len(problem) == 0:
				raise AttributeError()
		except AttributeError as e:
			ans = input('WARNING: Missing problem. Continue? (y/n)')
			if ans == 'n':
				sys.exit()
			problem = ''

		try:
			solution = re.search('#BEGIN_SOLUTION(.*)#END_SOLUTION', text, flags=re.S).group(1).strip()
			if len(solution) == 0:
				raise AttributeError()
		except AttributeError as e:
			ans = input('WARNING: Missing solution. Continue? (y/n)')
			if ans == 'n':
				sys.exit()
			solution = ''

		try:
			tags = [tag.strip() for tag in re.split('[,;]',re.search('#BEGIN_TAGS(.*)#END_TAGS', text, flags=re.S).group(1).strip())]
			if 'correct' not in tags and 'incorrect' not in tags:
				raise Exception('ERROR: Missing correct/incorrect tag')
			if len(tags) == 0:
				raise AttributeError()
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
			lambda m: f"<pre class='block'><code>{escapeHTML(m.group(1).strip())}</code></pre>",
			solution, flags=re.S)

		solution = re.sub(
			'<error>(.*?)</error>',
			lambda m: f"<samp class='error'>{escapeHTML(m.group(1).strip())}</samp>",
			solution, flags=re.S)

		solution = re.sub(
			'<output>(.*?)</output>',
			lambda m: f"<samp class='output'>{escapeHTML(m.group(1).strip())}</samp>",
			solution, flags=re.S)

		solution = '<div>' + solution + '</div>'
	return {'id' : 1, 'problem' : problem, 'solution' : solution, 'tags' : tags}


if __name__ == '__main__':
	try:
		if args.write or args.append:
			problemFile, outputFile = args.write if args.write else args.append

			problem = getProblem(problemFile)

			if args.write:
				
				# WRITE	

				with open(outputFile, 'w') as jsonFile:
					jsonFile.write(json.dumps({ 'content': [ problem ]},indent=4 if args.verbose else None))
			else:
				
				#APPEND
				
				try:
					with open(outputFile, 'r') as jsonFile:
						jsonFileData = json.loads(jsonFile.read())
				except:
					jsonFileData = None
					
				if jsonFileData is None:
					jsonFileData = { 'content': [ problem ] }
				else:
					if 'content' in jsonFileData:
						if isinstance(jsonFileData['content'], List):
							problem['id'] = min(set(range(1, len(jsonFileData['content'])+2)) - set([p['id'] for p in jsonFileData['content']]))
							jsonFileData['content'].append(problem)

				with open(outputFile, 'w') as jsonFile:
					jsonFile.write(json.dumps(jsonFileData, indent=4 if args.verbose else None ))
				
		elif args.insert or args.replace:

			#INSERT and REPLACE

			problemFile, outputFile, id = args.insert if args.insert else args.replace
			problem = getProblem(problemFile)
			
			with open(outputFile, 'r') as jsonFile:
				jsonFileData = json.loads(jsonFile.read())
					
				insertPos = None
				if 'content' in jsonFileData:
					if isinstance(jsonFileData['content'], List):
						for index, p in enumerate(jsonFileData['content']):
							if p['id'] == int(id):
								insertPos = index
								break
				if args.insert:
					if insertPos is not None:
						problem['id'] = min(set(range(1, len(jsonFileData['content'])+2)) - set([p['id'] for p in jsonFileData['content']]))
						jsonFileData['content'].insert(insertPos, problem)
					else:
						raise Exception('id not found')
				else:
					if insertPos is not None:
						problem['id'] = jsonFileData['content'][insertPos]['id']
						jsonFileData['content'][insertPos] = problem
					else:
						raise Exception('id not found')

				with open(outputFile, 'w') as jsonFile:
					jsonFile.write(json.dumps(jsonFileData, indent=4 if args.verbose else None ))

		elif args.remove:

			#REMOVE
			jsonFile, id = args.remove

			with open(jsonFile, 'r') as f:
				jsonFileData = json.loads(f.read())

			jsonFileData['content'] = [p for p in jsonFileData['content'] if p['id'] != int(id)]
			
			with open(jsonFile, 'w') as f:
				f.write(json.dumps(jsonFileData, indent=4 if args.verbose else None ))

	except Exception as e:
		print(e)



