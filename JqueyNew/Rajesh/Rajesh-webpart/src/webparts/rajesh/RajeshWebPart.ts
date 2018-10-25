import { Version,Environment, EnvironmentType  } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';

import styles from './RajeshWebPart.module.scss';
import * as strings from 'RajeshWebPartStrings';

export interface IRajeshWebPartProps {
  description: string;
}

export default class RajeshWebPart extends BaseClientSideWebPart<IRajeshWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.rajesh }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
          <div>
          <select id="cpdropdown" >CategoryName</select>
            </div>
        </div>
        <div id="lists">
        </div>
      </div>`;
      this.GetDropDown();
      this.Readyfunction();


  }
  Readyfunction() {
    var curl1 = this.context.pageContext.web.absoluteUrl;
alert("1");
    $(document).ready(function(){
      alert("2");
    $("#cpdropdown").change(function () {

      alert("enetred dispdata");
      var DropDownValue1 = $('#cpdropdown option:selected').text();
      alert(DropDownValue1);


      
      let html: string = '';
      if (Environment.type === EnvironmentType.Local) {
        this.domElement.querySelector('#lists').innerHTML = "sorry this does not work in local workbench";
      }

      else {
        // this.context.spHttpClient.get 
        // ( 

        var call = $.ajax({
          url: curl1 + "/_api/web/lists/getByTitle('ProductName')/Items/?$select=Title&$filter=(CategoryLookup/Category eq '" + DropDownValue1 + "')",
          type: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json;odata=verbose"
          }
        });
        call.done(function (data) {
          $("#lists").text('');
          var message = $("#lists");
          //message.append("<br/>");
          $.each(data.d.results, function (index, value) {
            message.append("<br/>", value.Title);



          });



        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
          var response = JSON.parse(jqXHR.responseText);
          var message = response ? response.error.message.value : textStatus;
          alert("Call failed. Error: " + message);
        });
      }
    });


  })
  }


  private GetDropDown() {
    var curl = this.context.pageContext.web.absoluteUrl;
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#lists').innerHTML = "sorry this does not work in local workbench";
    }

    else {
      // this.context.spHttpClient.get 
      // ( 

      var call = $.ajax({
        url: curl + "/_api/web/lists/getByTitle('Categoryname')/Items/?$select=Category",
        type: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });
      call.done(function (data) {
        $("#cpdropdown option").remove();
        var message = $("#cpdropdown");
        //message.append("<br/>");
        $.each(data.d.results, function (index, value) {
          message.append($("<option></option>")
            .text(value.Category));


        });



      });
      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });
    }
  }


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
