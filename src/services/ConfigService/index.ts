interface RepositoryConfig {
  projectId: string
  name: string
}

interface Config {
  server: {
    port: number
  }
  slack: {
    appToken: string
    signSecret: string
  }
  jenkins: {
    host: string
    deployJobPath: string
    username: string
    password: string
  }
  bitbucket: {
    host: string
    accessToken: string
    repositories: RepositoryConfig[]
  }
}

export class ConfigService {
  public readonly data: Config

  constructor(data: Config) {
    this.data = data
  }
}
