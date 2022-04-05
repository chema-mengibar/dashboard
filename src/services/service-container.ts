import ConfigService from './config-service';
import DataService from './data-service/data-service';
import WidgetService from './widget-service/widget-service';

const configService = new ConfigService();
const dataService = new DataService();
const widgetService = new WidgetService();

export default {
  configService,
  dataService,
  widgetService
};

