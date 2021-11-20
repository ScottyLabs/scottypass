import mongoose from 'mongoose';
import { PageTypes } from '../_enums/pageTypes';

export interface DashboardPage {
  name: string,
  page_type: PageTypes,
  url: string
}