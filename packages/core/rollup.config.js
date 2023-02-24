/*
 * @Author: MrAlenZhong
 * @Date: 2023-02-23 14:15:02
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2023-02-24 16:18:04
 * @Description: 
 */

import { readFile } from "fs/promises";
const pkg = JSON.parse(await readFile("./package.json"));

// import pkg from './package.json';
// const pkg = require('./package.json');
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from 'rollup-plugin-typescript';
import typescript from '@rollup/plugin-typescript';
import rollupBaseConfig from '../../rollup.config.js';
console.log("pkg  ",pkg);
export default Object.assign(rollupBaseConfig, {
  plugins: [
    postcss(),
    typescript(),
    commonjs()
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: Object.keys(pkg.peerDependencies),
});
