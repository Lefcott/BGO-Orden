import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { fieldShape } from '../../utils/field';
import { getFieldKeyTranslation } from '../../translations/fieldKeys';

import Text from './components/Text';
import List from './List';
import Group from './Group';
import Enum from './components/Enum';
import Select from './components/Select';
import Number from './components/Number';
import Image from './components/Image';
import { getLanguage } from './lang';

let timeoutId;

const FieldRenderer = props => {
  const { fields, data, updateAfter } = props;
  const languageCode = useSelector(store => store.language);
  const keyTranslation = getFieldKeyTranslation(languageCode);
  const language = getLanguage(languageCode);
  const [hasChanged, setHasChanged] = useState(false);
  const [newData, setNewData] = useState(data);

  const handleChange = updatedData => {
    setNewData(updatedData);
    props.onPartialChange(updatedData);

    if (props.saveButton) setHasChanged(true);
    else props.onChange(updatedData);
  };

  const handleSave = () => {
    props.onChange(newData);
    setHasChanged(false);
  };

  const updateData = changedData => {
    if (!updateAfter) return handleChange(changedData);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handleChange(changedData);
    }, updateAfter);
  };

  const handleUpdateData = (key, value) => {
    updateData({ ...newData, [key]: value });
  };

  const handleUpdateOptionData = changedData => {
    updateData({ ...newData, ...changedData });
  };

  return (
    <div className="fieldContainer">
      {fields.map(field => {
        if (field.fillable_by_user === false && !props.readOnly) return <div key={field.key} />;

        switch (field.input_type) {
          case 'number':
            return (
              <Number
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'text':
            return (
              <Text
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                multiline={false}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'textarea-small':
            return (
              <Text
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                multiline
                rows={4}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'textarea-medium':
            return (
              <Text
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                multiline
                rows={11}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'textarea-big':
            return (
              <Text
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                multiline
                rows={17}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'image':
            return (
              <Image
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'list':
            return (
              <List
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                onChange={value => handleUpdateData(field.key, value)}
                key={field.key}
              />
            );
          case 'enum':
            return (
              <Enum
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                onChange={value => handleUpdateData(field.key, value)}
                FieldRenderer={FieldRenderer}
                key={field.key}
              />
            );
          case 'group':
            return (
              <Group
                template={props.template}
                field={field}
                value={data[field.key]}
                readOnly={props.readOnly}
                multiline={false}
                onChange={value => handleUpdateData(field.key, value)}
                FieldRenderer={FieldRenderer}
                key={field.key}
              />
            );
          case 'select':
            return (
              <Select
                template={props.template}
                field={field}
                optionData={data}
                value={data[field.key]}
                readOnly={props.readOnly}
                onChange={value => handleUpdateData(field.key, value)}
                onChangeOptionData={handleUpdateOptionData}
                FieldRenderer={FieldRenderer}
                key={field.key}
              />
            );
          case 'button':
            return (
              <a href={data[field.key]} target="_blank">
                <Button
                  template={props.template}
                  value={data[field.key]}
                  readOnly={props.readOnly}
                  onChange={value => handleUpdateData(field.key, value)}
                  key={field.key}
                >
                  {field.name || keyTranslation[field.key]}
                </Button>
              </a>
            );
          default:
            return <div key={field.key} />;
        }
      })}
      {props.backButton && <Button onClick={props.onGoBack}>{language.back}</Button>}
      {props.saveButton && (
        <Button disabled={!hasChanged && !props.alwaysShowSaveButton} onClick={handleSave}>
          {language.save}
        </Button>
      )}
      <style jsx>
        {`
          .fieldContainer {
            width: 88%;
            margin-left: 6%;
          }
        `}
      </style>
    </div>
  );
};

FieldRenderer.propTypes = {
  data: PropTypes.object,
  fields: PropTypes.arrayOf(fieldShape),
  readOnly: PropTypes.bool,
  updateAfter: PropTypes.number,
  template: PropTypes.string,
  onChange: PropTypes.func,
  onPartialChange: PropTypes.func,
  onGoBack: PropTypes.func,
  saveButton: PropTypes.bool,
  backButton: PropTypes.bool,
  alwaysShowSaveButton: PropTypes.bool
};

FieldRenderer.defaultProps = {
  data: {},
  fields: [],
  readOnly: false,
  updateAfter: 0,
  template: 'default',
  onChange: () => {},
  onPartialChange: () => {},
  onGoBack: () => {},
  saveButton: false,
  backButton: false,
  alwaysShowSaveButton: false
};

export default FieldRenderer;
