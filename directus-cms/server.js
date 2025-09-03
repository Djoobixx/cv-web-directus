#!/usr/bin/env node

// Server pour Hostinger
const { spawn } = require('child_process');
const path = require('path');

// Démarrer Directus
const directus = spawn('npx', ['directus', 'start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || 3000
  }
});

directus.on('error', (err) => {
  console.error('Erreur Directus:', err);
  process.exit(1);
});

directus.on('close', (code) => {
  console.log(`Directus fermé avec le code ${code}`);
  process.exit(code);
});

// Gestion des signaux
process.on('SIGTERM', () => {
  directus.kill('SIGTERM');
});

process.on('SIGINT', () => {
  directus.kill('SIGINT');
});
