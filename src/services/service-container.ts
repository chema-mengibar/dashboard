import ConfigService from './config-service';
import DataService from './data-service';

const configService = new ConfigService();
const dataService = new DataService();

export default {
  configService,
  dataService
};

