import isMatch from 'date-fns/isMatch';
import isDate from 'date-fns/isDate';
import isAfter from 'date-fns/isAfter';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

type PluginValueType = string | boolean;
type PluginFieldsType = {
  [key: string]: any;
};

interface ConfigInterface {
  format?: string;
  isAfter?: string | Date;
  isEqual?: string | Date;
  required?: boolean;
}

type KeysEnum<T> = { [P in keyof Required<T>]: boolean };

const getParsedDate = (
  value: string,
  format?: string
): Date | typeof NaN | null => {
  return format ? parse(value, format, new Date()) : new Date(value);
};

const getComparedDate = (
  sourceDate?: Date | typeof NaN | null,
  configValue?: string | Date,
  format?: string
): Date | null => {
  let comparedDate;
  if (isDate(configValue)) {
    comparedDate = configValue as Date;
  } else if (typeof configValue === 'string') {
    comparedDate = getParsedDate(configValue, format);
  }

  if (!isValid(comparedDate)) {
    return null;
  }

  if (!isValid(sourceDate)) {
    return null;
  }

  return comparedDate as Date;
};


const checkIsAfter = (
  configValue: string | Date,
  sourceDate?: Date | typeof NaN | null,
  format?: string
) => {
  const comparedDate = getComparedDate(sourceDate, configValue, format);
  if (comparedDate === null) {
    return false;
  }

  return isAfter(sourceDate as Date, comparedDate);
};

const ValidDate =
  (func: (fields: PluginFieldsType) => ConfigInterface) =>
  (value: PluginValueType, fields: PluginFieldsType) => {
    const config = func(fields);
    const valid: KeysEnum<ConfigInterface> = {
      format: true,
      isAfter: true,
      required: true,
      isEqual: true,
    };

    if (typeof value !== 'string') {
      console.error(
        'Value should be a string! The result will be always invalid'
      );

      return false;
    }

    if (!config.required && value === '') {
      return true;
    }

    if (config.format !== undefined) {
      if (typeof config.format !== 'string') {
        console.error(
          'Format field should be a string! The result will be always invalid'
        );
        valid.format = false;
      } else {
        valid.format = isMatch(value, config.format);
      }
    }

    const sourceDate = getParsedDate(value, config.format);

    if (config.isAfter !== undefined) {
      valid.isAfter = checkIsAfter(config.isAfter, sourceDate, config.format);
    }

    return Object.values(valid).every((item) => item);
  };

export default ValidDate;
