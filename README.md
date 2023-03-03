## Node/Typescript starter

The simplest possible Node/Typescript starter project for quickly writing ts code.

- Hot reloading with nodemon.
- Environment variables using `dotenv` (just put them into `.env`).
- Run it with `npm run dev`

## Setup guide

Based on [this](https://khalilstemmler.com/blogs/typescript/node-starter-project/).

Install packages:

```
npm init -y
npm i --save-dev typescript nodemon ts-node @types/node
npm i dotenv
npx tsc --init
```

`nodemon.json`:

```
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

`tsconfig.json`:

```
{
  "compilerOptions": {
    "target": "es5",
    "baseUrl": ".",
    "lib": ["esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

`package.json`:

```
"dev": "ts-node src/index.ts"
```

`.env`

```
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

`src/index.ts`:

```
import * as dotenv from 'dotenv'
dotenv.config()
console.log('Hello world!', process.env.SECRET_KEY)
```

Making imports work with node modules ([answer](https://stackoverflow.com/questions/72796757/ts-node-typeerror-err-unknown-file-extension-unknown-file-extension-ts)):

`tsconfig.json`:

```
"compilerOptions": {
  "module": "ESNext" // or ES2015, ES2020
},
"ts-node": {
  // Tell ts-node CLI to install the --loader automatically
  "esm": true
}
```

`package.json`:

```
"dev": "ts-node src/index.ts",
"type": "module"
```

Fix local imports:

https://stackoverflow.com/questions/73449628/how-to-force-typescript-in-node-to-not-require-js-extension-when-importing-es6
