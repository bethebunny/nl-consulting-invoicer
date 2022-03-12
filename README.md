![Auto-deploy](https://github.com/bethebunny/nl-consulting-invoicer/actions/workflows/pages.yml/badge.svg)

# What's this?

I'm gonna be honest, you're probably in the wrong place. This is a very specialized tool I made for doing some invoicing,
and it's paired with some very specific Google sheets while using github pages for CI/CD and hosting, so I can just go to the
bookmark and paste a sheet and get a formatted invoice :) If you want to dig into the source code and get something useful
out of it, you're more than welcome!

The most interesting thing this project does is make use of the `es-react` project to import React as a web module import, so I
can code in TypeScript with React enabled, easily iterate locally, and then when I commit the code is (lightly) compiled
(so as to retain most of its readability) and deployed to GithubPages as a webapp.

# Try it out

https://bethebunny.github.io/nl-consulting-invoicer

# Basic React template

If you want a basic template that has a simple React app working along with the pages deployment system, check out
[the minimal-react-page tag](https://github.com/bethebunny/nl-consulting-invoicer/releases/tag/minimal-react-page), and
follow the instructions to create a minimal react page with typescript support.

# Local development

This project is designed to be easy to both read from a browser as well
as fast and easy to develop on. It avoids webpack or similar bundlers in favor
of relying on the browser's module system directly, and minimizing the number
of dependencies, build steps, and obfuscation, while still allowing for
good coding practices like types and modules. I first experimented with this process in
http://github.com/bethebunny/lorentz (try it out at http://bethebunny.github.io/lorentz).

I recommend using VSCode for development.

1. Make sure npm and python >=3 are installed locally.

2. Clone this repo

```
git clone https://github.com/bethebunny/nl-consulting-invoicer.git
cd nl-consulting-invoicer
```

3. Install dependencies

```
npm install && npm install typescript
```

4. Build 

This will set up a watcher to rebuild on file changes, with <1s build times once running

```
npx tsc --project . --watch
```

5. Local webserver

```
cp index.html dist/index.html
python -m http.server -d dist
```

6. Open your browser to https://localhost:8000

Now you should be able to make code changes, save the file, and refresh the browser page to see them reflected! You should also get source maps in the Chrome debugger.
