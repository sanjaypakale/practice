const { createTemplateAction } = require('@backstage/plugin-scaffolder-backend');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const stream = require('stream');

module.exports = createTemplateAction({
  id: 'custom:fetch-and-extract',
  schema: {
    input: {
      type: 'object',
      required: ['proxyPath', 'targetPath'],
      properties: {
        proxyPath: {
          type: 'string',
          description: 'The relative path to the proxy endpoint in Backstage.',
        },
        targetPath: {
          type: 'string',
          description: 'The directory to extract the ZIP file into.',
        },
      },
    },
  },
  async handler(ctx) {
    const { proxyPath, targetPath } = ctx.input;

    // Construct the full URL via the Backstage proxy
    const backstageProxyUrl = `${ctx.baseUrl}${proxyPath}`;
    ctx.logger.info(`Fetching file from proxy URL: ${backstageProxyUrl}`);

    const response = await fetch(backstageProxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from proxy URL: ${response.statusText}`);
    }

    const zipBuffer = await response.buffer();

    ctx.logger.info(`Extracting ZIP file to ${targetPath}`);
    await fs.promises.mkdir(targetPath, { recursive: true });

    const extractStream = unzipper.Extract({ path: targetPath });
    extractStream.on('close', () => {
      ctx.logger.info(`Extraction complete at ${targetPath}`);
    });

    const readable = new stream.PassThrough();
    readable.end(zipBuffer);
    readable.pipe(extractStream);

    await new Promise((resolve, reject) => {
      extractStream.on('close', resolve);
      extractStream.on('error', reject);
    });

    ctx.output('extractedPath', targetPath);
  },
});
