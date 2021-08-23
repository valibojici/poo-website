import json
import sys
import argparse

parser=argparse.ArgumentParser(
    description='''Prettify or uglify JSON file and output to stdout by default.''',)
group = parser.add_mutually_exclusive_group()
group.add_argument('-u', '--ugly', help='compact JSON',action='store_true')
group.add_argument('-p', '--pretty', help='prettify JSON',action='store_true')

parser.add_argument('file',help='input JSON file')
parser.add_argument('-o', '--output', help='output file')
args=parser.parse_args()

if __name__ == '__main__':
	try:
		with open(args.file, 'r') as f:
			jsonData = json.loads(f.read())
			if args.output is not None:
				with open(args.output, 'w') as g:
					g.write(json.dumps(jsonData, indent= None if args.ugly else 4))
			else:
				print(json.dumps(jsonData, indent= None if args.ugly else 4))
	except Exception as e:
		print(e)