import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import connectDB from '../config/db.js';

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([Task.deleteMany(), Project.deleteMany(), User.deleteMany()]);
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
    });

    const member1 = await User.create({
      name: 'John Member',
      email: 'john@demo.com',
      password: 'member123',
      role: 'member',
    });

    const member2 = await User.create({
      name: 'Sarah Developer',
      email: 'sarah@demo.com',
      password: 'member123',
      role: 'member',
    });

    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX',
      createdBy: admin._id,
      teamMembers: [
        { user: admin._id, role: 'admin' },
        { user: member1._id, role: 'member' },
        { user: member2._id, role: 'member' },
      ],
    });

    const project2 = await Project.create({
      title: 'Mobile App Launch',
      description: 'Launch MVP mobile application for iOS and Android',
      createdBy: admin._id,
      teamMembers: [
        { user: admin._id, role: 'admin' },
        { user: member2._id, role: 'admin' },
      ],
    });

    const project3 = await Project.create({
      title: 'Marketing Campaign',
      description: 'Q2 digital marketing campaign planning and execution',
      createdBy: member1._id,
      teamMembers: [
        { user: member1._id, role: 'admin' },
        { user: admin._id, role: 'member' },
      ],
    });

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    await Task.insertMany([
      {
        title: 'Design homepage mockup',
        description: 'Create Figma mockups for new homepage',
        priority: 'high',
        dueDate: yesterday,
        assignedTo: member2._id,
        project: project1._id,
        createdBy: admin._id,
        status: 'in_progress',
      },
      {
        title: 'Setup React project',
        description: 'Initialize Vite + React + Tailwind',
        priority: 'medium',
        dueDate: nextWeek,
        assignedTo: member1._id,
        project: project1._id,
        createdBy: admin._id,
        status: 'todo',
      },
      {
        title: 'API integration',
        description: 'Connect frontend to backend APIs',
        priority: 'high',
        dueDate: nextWeek,
        assignedTo: member1._id,
        project: project1._id,
        createdBy: admin._id,
        status: 'todo',
      },
      {
        title: 'User authentication flow',
        description: 'Implement login/signup with JWT',
        priority: 'high',
        dueDate: lastWeek,
        assignedTo: member2._id,
        project: project1._id,
        createdBy: admin._id,
        status: 'completed',
      },
      {
        title: 'App store submission',
        description: 'Prepare and submit to App Store',
        priority: 'high',
        dueDate: nextWeek,
        assignedTo: member2._id,
        project: project2._id,
        createdBy: admin._id,
        status: 'in_progress',
      },
      {
        title: 'Beta testing',
        description: 'Run beta test with 50 users',
        priority: 'medium',
        dueDate: yesterday,
        assignedTo: admin._id,
        project: project2._id,
        createdBy: admin._id,
        status: 'todo',
      },
      {
        title: 'Social media content',
        description: 'Create posts for Instagram and LinkedIn',
        priority: 'low',
        dueDate: nextWeek,
        assignedTo: member1._id,
        project: project3._id,
        createdBy: member1._id,
        status: 'todo',
      },
      {
        title: 'Email newsletter',
        description: 'Draft and send Q2 newsletter',
        priority: 'medium',
        dueDate: lastWeek,
        assignedTo: admin._id,
        project: project3._id,
        createdBy: member1._id,
        status: 'completed',
      },
    ]);

    console.log('\n✅ Seed data created successfully!\n');
    console.log('Demo Credentials:');
    console.log('─────────────────────────────────');
    console.log('Admin:  admin@demo.com  / admin123');
    console.log('Member: john@demo.com   / member123');
    console.log('Member: sarah@demo.com  / member123');
    console.log('─────────────────────────────────\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
