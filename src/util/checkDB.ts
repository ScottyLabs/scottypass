import Application from '../models/Application';
import mongoose from 'mongoose';

export default async () => {
  const dashboard = await Application.findOne({ name: 'API Dashboard' });
  if (!process.env.DASHBOARD_PK) {
    process.exit(-1);
  }
  if (!dashboard) {
    const newApp = new Application({
      _id: new mongoose.Types.ObjectId('0'.repeat(12)),
      name: 'API Dashboard',
      publicKey: process.env.DASHBOARD_PK,
    });
    await newApp.save();
  }
};
