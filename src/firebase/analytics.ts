import { collection, getDocs, query, where, orderBy, getCountFromServer } from 'firebase/firestore';
import { format, startOfMonth, subMonths, addMonths } from 'date-fns';
import { db } from './config';

export interface MonthlyRevenue {
  totalRevenue: number;
  totalInvoices: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export const getMonthlyRevenue = async (months = 6): Promise<MonthlyRevenue> => {
  const start = startOfMonth(subMonths(new Date(), months - 1));
  const invoicesRef = collection(db, 'invoices');
  const q = query(
    invoicesRef,
    where('status', '==', 'paid'),
    where('createdAt', '>=', start),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(q);

  const revenueByMonth: Record<string, number> = {};
  let totalRevenue = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const createdAt: Date | undefined = data.createdAt?.toDate?.();
    if (!createdAt) return;
    const month = format(createdAt, 'MMM');
    const amount = data.amount || 0;
    totalRevenue += amount;
    revenueByMonth[month] = (revenueByMonth[month] || 0) + amount;
  });

  const monthlyRevenue = [] as { month: string; revenue: number }[];
  for (let i = 0; i < months; i++) {
    const month = format(addMonths(start, i), 'MMM');
    monthlyRevenue.push({ month, revenue: revenueByMonth[month] || 0 });
  }

  return { totalRevenue, totalInvoices: snapshot.size, monthlyRevenue };
};

export interface ProjectStatusCounts {
  totalProjects: number;
  projectStatus: { status: string; count: number }[];
}

export const getProjectStatusCounts = async (months = 6): Promise<ProjectStatusCounts> => {
  const start = startOfMonth(subMonths(new Date(), months - 1));
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, where('createdAt', '>=', start), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);

  const statusCounts: Record<string, number> = {};
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const status = data.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const projectStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  return { totalProjects: snapshot.size, projectStatus };
};

export interface TaskGrowth {
  totalTasks: number;
  taskGrowth: { month: string; tasks: number }[];
}

export const getMonthlyTaskCompletion = async (months = 6): Promise<TaskGrowth> => {
  const start = startOfMonth(subMonths(new Date(), months - 1));
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('status', '==', 'done'),
    where('createdAt', '>=', start),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);

  const countByMonth: Record<string, number> = {};
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const createdAt: Date | undefined = data.createdAt?.toDate?.();
    if (!createdAt) return;
    const month = format(createdAt, 'MMM');
    countByMonth[month] = (countByMonth[month] || 0) + 1;
  });

  const taskGrowth = [] as { month: string; tasks: number }[];
  for (let i = 0; i < months; i++) {
    const month = format(addMonths(start, i), 'MMM');
    taskGrowth.push({ month, tasks: countByMonth[month] || 0 });
  }

  return { totalTasks: snapshot.size, taskGrowth };
};

export interface FileUploadStats {
  fileUploads: { month: string; uploads: number }[];
}

export const getFileUploadStats = async (months = 6): Promise<FileUploadStats> => {
  const start = startOfMonth(subMonths(new Date(), months - 1));
  const filesRef = collection(db, 'files');
  const q = query(filesRef, where('uploadedAt', '>=', start), orderBy('uploadedAt', 'asc'));
  const snapshot = await getDocs(q);

  const uploadsByMonth: Record<string, number> = {};
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const uploadedAt: Date | undefined = data.uploadedAt?.toDate?.();
    if (!uploadedAt) return;
    const month = format(uploadedAt, 'MMM');
    uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
  });

  const fileUploads = [] as { month: string; uploads: number }[];
  for (let i = 0; i < months; i++) {
    const month = format(addMonths(start, i), 'MMM');
    fileUploads.push({ month, uploads: uploadsByMonth[month] || 0 });
  }

  return { fileUploads };
};

export const getTotalCount = async (collectionName: string): Promise<number> => {
  const ref = collection(db, collectionName);
  const snap = await getCountFromServer(ref);
  return snap.data().count;
};
