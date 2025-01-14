const { writeFileSync } = require("fs");
const path = require("path");

const { graphql } = require("@octokit/graphql");
const prettier = require("prettier");

const QUERY = `
  {
    endpoints(filter: { isLegacy: false, isGithubCloudOnly: false }) {
      name
      scope(format: CAMELCASE)
      id(format: CAMELCASE)
      method
      url
      isDeprecated
      description
      documentationUrl
      previews(required: true) {
        name
      }
      headers {
        name
        value
      }
      parameters {
        name
        description
        in
        type
        required
        enum
        allowNull
        mapToData
        validation
        alias
        deprecated
      }
      responses {
        code
        description
        examples {
          data
        }
      }
      renamed {
        before(format: CAMELCASE)
        after(format: CAMELCASE)
        date
        note
      }
    }
  }`;

main();

async function main() {
  const { endpoints } = await graphql(QUERY, {
    url: "https://octokit-routes-graphql-server.now.sh/"
  });

  writeFileSync(
    path.resolve(__dirname, "generated", "endpoints.json"),
    prettier.format(JSON.stringify(endpoints), {
      parser: "json"
    })
  );
}
