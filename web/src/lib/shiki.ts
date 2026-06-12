import { codeToHtml } from 'shiki';

type SupportedLang = 'bash' | 'javascript' | 'python' | 'json';

export async function highlight(code: string, lang: SupportedLang): Promise<string> {
  return codeToHtml(code, {
    lang,
    theme: 'github-dark',
  });
}
