import { MainLayout } from '@/components/layout';
import { TaskContainer } from '@/components/Task/taskContainer';
import { useRouter } from 'next/router';
import React from 'react';

const ProjectTasks = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>{id ? <TaskContainer type="project" entityId={id as string} /> : ''}</>
  );
};

export default ProjectTasks;
