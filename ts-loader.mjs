import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import ts from 'typescript';

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    if (!extname(specifier)) {
      try {
        return await defaultResolve(specifier + '.ts', context, defaultResolve);
      } catch {
        return defaultResolve(specifier + '/index.ts', context, defaultResolve);
      }
    }
    return defaultResolve(specifier, context, defaultResolve);
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.ts')) {
    const source = await readFile(new URL(url), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 }
    });
    return { format: 'module', source: outputText, shortCircuit: true };
  }
  return defaultLoad(url, context, defaultLoad);
}
