// import mongoose from 'mongoose';
// import { PageTypes } from '../_enums/pageTypes';
// import { DashboardAPI } from '../types';

// const page = {
//   name: String,
//   page_type: {
//     type: String,
//     enum: Object.values(PageTypes)
//   },
//   url: String
// }

// const dashboardAPISchema = new mongoose.Schema({
//   name: String,
//   pages: [page],
//   public: Boolean
// })

// export default mongoose.model<DashboardAPI>('DashboardAPI', dashboardAPISchema);