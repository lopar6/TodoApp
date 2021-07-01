
export const cyclePriority = (priority) => {
    if (priority === 'low')   {return 'medium'}
    if (priority === 'medium'){return 'high'}
    if (priority === 'high')  {return 'low'}    
}