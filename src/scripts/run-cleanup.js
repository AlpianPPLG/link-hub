#!/usr/bin/env node

/**
 * Database cleanup script for custom colors
 * This script removes problematic custom color values that conflict with theme preferences
 */

const fs = require('fs');
const path = require('path');

// Read the SQL cleanup script
const sqlScriptPath = path.join(__dirname, 'clean-custom-colors.sql');
const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

console.log('🧹 Custom Color Cleanup Script');
console.log('============================');
console.log('');
console.log('This script will clean up problematic custom color values in your database.');
console.log('It will remove black (#000000) and white (#ffffff) custom colors that');
console.log('can conflict with theme styling.');
console.log('');
console.log('SQL commands to run:');
console.log('');
console.log(sqlScript);
console.log('');
console.log('To run this script on your database, execute the following commands');
console.log('in your database management tool or command line:');
console.log('');
console.log('# For MySQL/MariaDB:');
console.log('mysql -u [username] -p [database_name] < src/scripts/clean-custom-colors.sql');
console.log('');
console.log('# For PostgreSQL:');
console.log('psql -U [username] -d [database_name] -f src/scripts/clean-custom-colors.sql');
console.log('');
console.log('Or copy and paste the SQL commands above into your database tool.');