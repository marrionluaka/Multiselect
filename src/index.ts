type SelectAllParams<T> = {
  selectedIds: T[];
  selectedId: T;
  ids: T[];
  id: T;
};

export function select<T>(selectedIds: T[], selectedId: T, id: T): [T, T[]] {
  if (!selectedIds.includes(id)) return [id, selectedIds.concat(id)];

  if (selectedIds.length === 1)
    return selectedIds.includes(id) ? [id, []] : [selectedId, selectedIds];

  const pivotIndex = selectedIds.findIndex((x) => x === id);
  const nextSelectedIndex =
    selectedIds[pivotIndex + 1] ?? selectedIds[pivotIndex - 1] ?? id;
  const nextSelectedIndices = selectedIds.filter((x) => x !== id);

  return [nextSelectedIndex, nextSelectedIndices];
}

export function selectAll<T>({
  selectedIds,
  selectedId,
  ids,
  id,
}: SelectAllParams<T>): T[] {
  const reverseIndexLookup = (x: T) => ids.indexOf(x);
  const [_index, _selectedIndex] = [id, selectedId].map(reverseIndexLookup);
  const _selectedIndices = selectedIds.map(reverseIndexLookup);

  if (selectedIds.length <= 1)
    return _selectAll<T>(ids, _selectedIndex, _index);

  const nonConsecutiveIndex = _getNonConsecutiveIndex(_selectedIndices);

  if (nonConsecutiveIndex === -1)
    return _selectAll<T>(ids, _selectedIndex, _index);

  if (reverseIndexLookup(selectedId) > reverseIndexLookup(id)) {
    // current selection extends backward to meet target
    return ids.slice(_index, _selectedIndex + 1);
  }

  // select remaining indices
  return selectedIds
    .slice(0, nonConsecutiveIndex)
    .concat(ids.slice(_selectedIndex, _index + 1));
}

function _selectAll<T>(indices: T[], selectedIndex: number, index: number) {
  if (selectedIndex > index) {
    // current selection extends backward to meet target
    return indices.slice(index, selectedIndex + 1);
  }

  // current selection extends forward to meet target
  return indices.slice(selectedIndex, index + 1);
}

function _getNonConsecutiveIndex(selectedIndices: number[]) {
  let nonConsecutiveIndex = -1;

  for (let i = 1, len = selectedIndices.length; i < len; i++) {
    const [a, b] = [selectedIndices[i - 1], selectedIndices[i]];
    if (a > b || Math.abs(a - b) > 1) {
      nonConsecutiveIndex = i;
    }
  }

  return nonConsecutiveIndex;
}
