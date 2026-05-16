export const getMemberRole = (project, userId) => {
  const member = project.teamMembers.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member?.role || null;
};

export const isProjectAdmin = (project, userId) => {
  if (project.createdBy.toString() === userId.toString()) return true;
  return getMemberRole(project, userId) === 'admin';
};

export const isProjectMember = (project, userId) => {
  if (project.createdBy.toString() === userId.toString()) return true;
  return project.teamMembers.some(
    (m) => m.user.toString() === userId.toString()
  );
};
