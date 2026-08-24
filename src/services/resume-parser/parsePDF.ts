import { PDFParse } from 'pdf-parse';

/**
 * Extracts raw text content from a PDF buffer.
 * Uses pdf-parse v2 API (PDFParse class with buffer source).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document');
  } finally {
    await parser.destroy();
  }
}
