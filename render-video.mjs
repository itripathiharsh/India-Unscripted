import { chromium } from 'file:///D:/all farzi project/social media wala test/google-flow-mcp-main/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function generateVideo() {
  console.log('Connecting to browser via CDP...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  // High-def 1080p canvas
  await page.setViewportSize({ width: 1920, height: 1080 });

  const url = 'http://127.0.0.1:4040/render-intro.html';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  console.log('Waiting for mapReady flag...');
  await page.waitForFunction(() => window.mapReady === true, { timeout: 10000 });
  console.log('Survey of India cartography paths ready in DOM.');

  const outputPath = path.resolve('assets/intro/cinematic-intro.mp4');
  console.log('Target output:', outputPath);

  // Setup ffmpeg process
  const fps = 30;
  const totalDuration = 7.5;
  const totalFrames = Math.floor(totalDuration * fps);

  console.log(`Starting frame capture: ${totalFrames} frames @ ${fps} fps...`);

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', String(fps),
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'fast',
    '-movflags', '+faststart',
    outputPath
  ]);

  ffmpeg.stderr.on('data', data => {
    // keep ffmpeg quiet unless error
    const str = data.toString();
    if (str.includes('Error') || str.includes('fatal')) {
      console.error('ffmpeg stderr:', str);
    }
  });

  ffmpeg.on('close', code => {
    console.log(`ffmpeg process finished with code ${code}`);
  });

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((time) => {
      window.seekTime(time);
    }, t);

    // Grab frame buffer
    const buffer = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(buffer);

    if (f % 30 === 0 || f === totalFrames - 1) {
      const pct = Math.round((f / totalFrames) * 100);
      console.log(`Render progress: ${pct}% (frame ${f}/${totalFrames}, t = ${t.toFixed(2)}s)`);
    }
  }

  ffmpeg.stdin.end();

  // Wait for ffmpeg to finish
  await new Promise(resolve => ffmpeg.on('close', resolve));

  await page.close();
  console.log('Video generated successfully! Size:', fs.statSync(outputPath).size, 'bytes');
  process.exit(0);
}

generateVideo().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});

