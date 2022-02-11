import mongoose from 'mongoose';
import { DashboardPage } from 'dashboard-page';

export interface DashboardAPI {
  _id: mongoose.Types.ObjectId;
  name: string;
  pages: Array<DashboardPage>;
  public: boolean
}


