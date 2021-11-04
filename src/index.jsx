import React from 'react';
import { render } from 'react-dom';
import PreviewLink from './PreviewLink.jsx';

import './style.sass';

function sub(text, entity, locale) {
  let result = text;
  entity["locale"] = locale;
  Object.keys(entity)
    .forEach((key) => {
      if(typeof entity[key] === "object"){
        if(entity[key] && entity[key][locale]){
          result = result.replace('${' + key + '}', entity[key][locale]);
        }
      } else{
        result = result.replace('${' + key + '}', entity[key]);
      }
    });
  return result;
}

function deserialize(plugin) {
  const fieldValue = plugin.getFieldValue(plugin.fieldPath);

  if (!fieldValue) {
    if (plugin.parameters.instance.previewLinks) {
      return [
        {
          stage: "Live",
          id: 1,
        },
        {
          stage: "Preview",
          id: 2,
        },
      ];
    }

    return [];
  }

  return JSON.parse(fieldValue);
}

window.DatoCmsPlugin.init().then((plugin) => {
  plugin.startAutoResizer();

  class App extends React.Component {
    constructor(props) {
      super(props);
      // console.log("locale", plugin.locale)
      // console.log("plugin.parameters", plugin.parameters)
      this.state = {
        previewLinks: deserialize(plugin),
      };
    }

    componentDidMount() {
      this.unsubscribe = plugin.addFieldChangeListener(plugin.fieldPath, () => {
        this.setState({ previewLinks: deserialize(plugin) });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const { previewLinks } = this.state;
      // console.log("previewLinks", previewLinks)
      const global = JSON.parse(plugin.parameters.global.global) || {};
      
      const entity = {
        ...global,
        id: plugin.itemId,
      };
      
      Object.keys(plugin.fields)
        .forEach((key) => {
          const field = plugin.fields[key];
          if (field.relationships.item_type.data.id === plugin.itemType.id) {
            const fieldKey = field.attributes.api_key;
            const fieldValue = plugin.getFieldValue(field.attributes.api_key, plugin.locale);
            entity[fieldKey] = fieldValue;
          }
        });
      // console.log("entity", entity);

      let locale = plugin.locale;
      const buttons = JSON.parse(plugin.parameters.instance.previewLinks) || [];
      
      return (
        <div className="previewLinks">
          {/* {previewLinks.map(this.renderPreviewLink.bind(this))} */}
          {buttons.map((btn, i) => (
            <a
            key={locale + i.toString()}
            href={`${sub(btn.link, entity, locale)}`}
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
            >
            {`${sub(btn.text, entity, locale)}`}
          </a>
          ))}
        </div>
      );
    }
  }

  render(<App />, document.body);
});
