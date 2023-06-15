import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { gql, graphql } from "lightning/uiGraphQLApi";

export default class UpdateDreaminEvent extends LightningElement {

    recordId;
    recordName;

    @wire(graphql, {
        query: gql`
          query dreaminEvent {
            uiapi {
              query {
                DreaminEventInstance__c (where: { Location__City__s: { eq: "Paris" } }) {
                  edges {
                    node {
                      Id
                      Name {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: "$variables",
        operationName: "dreaminEvent"
      })
      graphqlQueryResult({ data, errors }) {
        if (data) {
          this.recordId = data.uiapi.query.DreaminEventInstance__c.edges[0].node.Id;
          this.recordName = data.uiapi.query.DreaminEventInstance__c.edges[0].node.Name.value;
          this.errors = undefined;
        } else if (errors) {
          this.errors = errors;
        }
      }

    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD] })
    account;

    get name() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    handleSave() {

        // Create the recordInput object
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[NAME_FIELD.fieldApiName] = this.refs.eventname.value;
        
        const recordInput = { fields };
        
        updateRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record updated',
                            variant: 'success'
                        })
                    );
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
    }
}