"""
Copies javascript code from code.js to snippet.html and stores the result in
a text file for easy pasting into the snippet UI.
"""

from string import Template

JS_FILE = 'code.js'
CSS_FILE = 'styles.css'
SNIPPET_FILE = 'snippet.html'
OUTPUT_FILE = 'snippet.txt'


def compile_snippet():
    try:
        javascript_file = open(JS_FILE, 'r')
        css_file = open(CSS_FILE, 'r')
        snippet_file = open(SNIPPET_FILE, 'r')

        snippet_template = Template(snippet_file.read())
        snippet_code = snippet_template.substitute({
            'css': css_file.read(),
            'js': javascript_file.read(),
        })

        snippet_file.close()
        css_file.close()
        javascript_file.close()

        output_file = open(OUTPUT_FILE, 'w')
        output_file.write(snippet_code)
        output_file.close()
    except IOError:
        print 'Error compiling snippet'

if __name__ == '__main__':
    compile_snippet()
