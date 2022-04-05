import ConfigService from './config-service';
import DataService from './data-service/data-service';
import WidgetService from './widget-service/widget-service';

export interface Services {
  configService : ConfigService
  dataService : DataService
  widgetService : WidgetService
}