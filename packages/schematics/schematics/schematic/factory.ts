/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  move,
  partitionApplyMerge,
  template,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';


export default function (options: Schema): Rule {
  const schematicsVersion = require('@angular-devkit/schematics/package.json').version;
  const coreVersion = require('@angular-devkit/core/package.json').version;

  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask(options.name));

    return mergeWith(apply(url('./files'), [
      partitionApplyMerge(
        (p: Path) => !/\/src\/.*?\/files\//.test(p),
        template({
          ...options as object,
          coreVersion,
          schematicsVersion,
          dot: '.',
          dasherize: strings.dasherize,
        }),
      ),
      move(options.name),
    ]));
  };
}
