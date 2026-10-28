// Splits a text around the words to set in bold, so a component can wrap
// them in <b> without writing HTML into the data.

export interface EmphasisParts {
  before: string;
  emphasis: string;
  after: string;
}

// Without emphasis, or when the words are not in the text, everything is in
// "before".
export function splitEmphasis(text: string, emphasis?: string): EmphasisParts {
  let parts: EmphasisParts = { before: text, emphasis: '', after: '' };
  if (emphasis === undefined || emphasis === '') {
    return parts;
  }
  const start = text.indexOf(emphasis);
  if (start === -1) {
    return parts;
  }
  const end = start + emphasis.length;
  parts = {
    before: text.slice(0, start),
    emphasis,
    after: text.slice(end),
  };
  return parts;
}
