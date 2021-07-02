
export const cyclePriority = (priority) => {
    return priority < 3 ? priority += 1 : 1
}