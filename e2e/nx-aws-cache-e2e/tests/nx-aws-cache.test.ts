import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-aws-cache e2e', () => {
  it('should create nx-aws-cache', async (done) => {
    const plugin = uniq('nx-aws-cache');
    ensureNxProject('@nx-aws/nx-aws-cache', 'dist/packages/nx-aws-cache');
    await runNxCommandAsync(
      `generate @nx-aws/nx-aws-cache:nxAwsCache ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-aws-cache');
      ensureNxProject('@nx-aws/nx-aws-cache', 'dist/packages/nx-aws-cache');
      await runNxCommandAsync(
        `generate @nx-aws/nx-aws-cache:nxAwsCache ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-aws-cache');
      ensureNxProject('@nx-aws/nx-aws-cache', 'dist/packages/nx-aws-cache');
      await runNxCommandAsync(
        `generate @nx-aws/nx-aws-cache:nxAwsCache ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});