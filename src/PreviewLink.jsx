import React from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import Textarea from 'react-textarea-autosize';
import cn from 'classname';
import AutoUpdateTime from './AutoUpdateTime.jsx';

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

export default class PreviewLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: props.previewLink.stage,
      url: props.previewLink.url,
      focus: false,
    };
  }

  handleChange(e) {
    this.setState({ previewLink: e.target.value });
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur(e) {
    const { onEdit } = this.props;

    this.setState({ focus: false });
    onEdit(e.target.value);
  }

  render() {
    const { previewLink, onDelete } = this.props;
    const { url, focus, stage } = this.state;

    return (
      <a href={url}>
        {stage}
      </a>
      // <div key={previewLink.timestamp} className={cn('notes__item', { 'in-focus': focus })}>
      //   {stage} - {url}
      // </div>
    );
  }
}

PreviewLink.propTypes = {
  previewLink: PropTypes.shape({
    stage: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
