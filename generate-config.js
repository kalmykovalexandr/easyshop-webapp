#!/usr/bin/env node

/**
 * EasyShop Frontend Configuration Generator
 * 
 * This script generates a dynamic config.js file based on environment variables.
 * It replaces the static config.js with environment-specific values.
 */

const fs = require('fs');
const path = require('path');

// Default configuration values
const defaultConfig = {
  API_BASE: '/api',
  AUTH_SERVER_URL: 'http://localhost:9001'
};

// Environment-specific configuration
const config = {
  API_BASE: process.env.API_BASE_URL || defaultConfig.API_BASE,
  AUTH_SERVER_URL: process.env.AUTH_SERVER_URL || defaultConfig.AUTH_SERVER_URL,
  APP_NAME: process.env.APP_NAME || 'EasyShop',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true' || false,
  ENVIRONMENT: process.env.SPRING_PROFILES_ACTIVE || 'local'
};

// Generate config.js content
const configContent = `window.EASYSHOP_CONFIG = ${JSON.stringify(config, null, 2)};`;

// Write config.js to public directory
const publicDir = path.join(__dirname, 'public');
const configPath = path.join(publicDir, 'config.js');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write config file
fs.writeFileSync(configPath, configContent);

console.log('✅ Frontend configuration generated successfully');
console.log('📁 Config file:', configPath);
console.log('⚙️  Configuration:', JSON.stringify(config, null, 2));
