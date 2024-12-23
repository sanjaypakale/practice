import { createAction } from '@backstage/plugin-scaffolder-backend';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import fetch from 'cross-fetch';

// Define the custom action
export const downloadAndExtractZipAction = createAction({
  id: 'download:extract-zip',
  description: 'Download a ZIP file from a proxy URL, save it, and extract it',
  handler: async ({ logger, input, workspace, discoveryApi }) => {
    const { proxyUrl, extractPath } = input;
    const workspacePath = workspace.path;
    const zipFilePath = path.join(workspacePath, 'downloaded.zip');

    try {
      // Step 2: Resolve the actual URL using DiscoveryApi
      const actualUrl = await discoveryApi.getBaseUrl({ id: proxyUrl });

      logger.info(`Resolved actual URL: ${actualUrl}`);

      // Step 3: Download the ZIP file using cross-fetch (handling binary data)
      const response = await fetch(actualUrl);
      if (!response.ok) {
        throw new Error(`Failed to download ZIP file. Status: ${response.status}`);
      }

      // Check if the response is of type "application/octet-stream"
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/octet-stream')) {
        throw new Error(`Expected content-type "application/octet-stream", but got ${contentType}`);
      }

      // Step 4: Save the binary data (ZIP file) to the workspace
      const buffer = await response.buffer();
      fs.writeFileSync(zipFilePath, buffer);
      logger.info(`ZIP file downloaded to ${zipFilePath}`);

      // Step 5: Extract the ZIP file
      const extractDir = path.join(workspacePath, extractPath);

      // Ensure the extraction path exists
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }

      // Extract the ZIP file to the specified directory
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', () => {
          logger.info(`ZIP file extracted to ${extractDir}`);
        })
        .on('error', (err) => {
          throw new Error(`Failed to extract ZIP file: ${err.message}`);
        });

    } catch (error) {
      logger.error(`Error in download and extract action: ${error.message}`);
      throw error;
    }
  },
});
