import { LightningElement, wire } from "lwc";
import { gql, graphql, refreshGraphQL } from "lightning/uiGraphQLApi";

export default class DreaminEventExplorer extends LightningElement {
  results;
  errors;
  isActive = true;
  startDate = new Date().toISOString();
  startDateFilter = new Date().toISOString().split('T')[0];
  graphqlData;

  @wire(graphql, {
    query: gql`
      query dreaminEvents($isActive: Boolean, $startDateFilter: Date) {
        uiapi {
          query {
            DreaminEventInstance__c(where: { EventDate__c: { gt: { value: $startDateFilter } }, DreaminEvent__r: { IsActive__c: { eq: $isActive } } }, orderBy: { EventDate__c: { order: ASC } }) {
              edges {
                node {
                  Name {
                    value
                  }
                  Location__City__s {
                    value
                    displayValue
                    label
                  }
                  EventDate__c {
                    value
                    displayValue
                    format
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: "$variables",
    operationName: "dreaminEvents"
  })
  graphqlQueryResult(result) {
    this.graphqlData = result;
    const { data, errors } = result;
    if (data) {
      this.results = data.uiapi.query.DreaminEventInstance__c.edges.map((edge) => edge.node);
      this.errors = undefined;
    } else if (errors) {
      this.errors = errors;
    }
  }

  get variables() {
    return {
      isActive: this.isActive,
      startDateFilter: this.startDateFilter
    };
  }

  handleActiveChange(event) {
    this.isActive = event.detail.checked;
  }

  handleDateChange(event) {
    console.log("handleDateChange");
    this.startDateFilter = event.detail.value;
  }

  async refresh() {
    return refreshGraphQL(this.graphqlData);
  }
}
