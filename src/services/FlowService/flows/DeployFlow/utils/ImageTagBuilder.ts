/**
 * Generate docker image name from a branch name.
 *
 * Implements the logic from gradle version plugin
 * @see {@link https://bitbucket.atc.services/projects/GRADLE/repos/version-plugin}
 */
export class ImageTagBuilder {
  constructor(public readonly branchName: string) {}

  exec() {
    return `0.0.0-${sanitize(shortBranch(this.branchName))}-SNAPSHOT`
  }
}

function sanitize(str: string) {
  const sanePattern = /[^0-9A-Za-z]/g
  return str.replace(sanePattern, '-')
}

function shortBranch(branchName: string) {
  // eslint-disable-next-line no-useless-escape
  const wordPattern = /([^\/_]*[\/_])?(([^\/-]+[\/-]){0,3}[^\/-]+).*/g
  const match = wordPattern.exec(branchName)
  return match ? match[2] : branchName
}
