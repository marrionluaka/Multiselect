import { select, selectAll } from ".";

describe("multiselect", () => {
  let indices: number[];
  let selectedIndex: number;
  let selectedIndices: number[];

  beforeEach(() => {
    indices = [...Array(7).keys()];
    selectedIndex = 0;
    selectedIndices = [0];
  });

  describe("select", () => {
    it("should select an index and add it to the list of selected indices", () => {
      expect(select(selectedIndices, selectedIndex, 2)).toEqual([2, [0, 2]]);
    });

    it("should remove an index from the list of selected indices", () => {
      const allIndices = selectAll({
        selectedIds: selectedIndices,
        selectedId: selectedIndex,
        ids: indices,
        id: 3,
      });

      expect(select(allIndices, selectedIndex, 2)).toEqual([3, [0, 1, 3]]);
    });

    it("should remove an index even when it is the only index in the selected indices", () => {
      expect(select(selectedIndices, selectedIndex, 0)).toEqual([0, []]);
    });
  });

  describe("selectAll", () => {
    beforeEach(() => {
      selectedIndices = selectAll({
        selectedIds: selectedIndices,
        selectedId: selectedIndex,
        ids: indices,
        id: 4,
      });
    });

    it("should select multiple indices given a range", () => {
      expect(selectedIndices).toEqual([0, 1, 2, 3, 4]);
    });

    it("should select multiple indices starting from the current index after removing an index from the list of selected indices", () => {
      const [nextSelectedIndex, nextSelectedIndices] = select(
        selectedIndices,
        selectedIndex,
        2
      );
      expect(nextSelectedIndices).toEqual([0, 1, 3, 4]);

      selectedIndices = selectAll({
        selectedIds: nextSelectedIndices,
        selectedId: nextSelectedIndex,
        ids: indices,
        id: 5,
      });
      expect(selectedIndices).toEqual([0, 1, 3, 4, 5]);
    });

    it("should select multiple indices starting from the next selected index after removing current selected index", () => {
      let [nextIndex, nextIndices] = select(selectedIndices, selectedIndex, 4);
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 4);
      expect(nextIndices).toEqual([0, 1, 2, 3, 4]);

      selectedIndices = selectAll({
        selectedIds: nextIndices,
        selectedId: nextIndex,
        ids: indices,
        id: 5,
      });
      expect(selectedIndices).toEqual([4, 5]);
    });

    it("should select multiple indices starting from the previous selected index after removing current selected index", () => {
      // remove a single index
      let [nextIndex, nextIndices] = select(selectedIndices, selectedIndex, 2);
      expect(nextIndices).toEqual([0, 1, 3, 4]);

      // remove the currently selected index
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 4);
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 4);
      expect(nextIndices).toEqual([0, 1, 3, 4]);

      selectedIndices = selectAll({
        selectedIds: nextIndices,
        selectedId: nextIndex,
        ids: indices,
        id: 6,
      });
      expect(selectedIndices).toEqual([0, 1, 4, 5, 6]);
    });

    it("should select indices starting from the last selected index", () => {
      const [nextSelectedIndex, nextSelectedIndices] = select(
        selectedIndices,
        selectedIndex,
        2
      );
      expect(nextSelectedIndices).toEqual([0, 1, 3, 4]);

      selectedIndices = selectAll({
        selectedIds: nextSelectedIndices,
        selectedId: nextSelectedIndex,
        ids: indices,
        id: 2,
      });
      expect(selectedIndices).toEqual([2, 3]);
    });
  });

  describe("selectAll (with filtered subset of indices)", () => {
    beforeEach(() => {
      indices = indices.map((x) => x * 7);
      selectedIndices = selectAll({
        selectedIds: selectedIndices,
        selectedId: selectedIndex,
        ids: indices,
        id: 28,
      });
    });

    it("should select multiple indices given a range", () => {
      expect(selectedIndices).toEqual([0, 7, 14, 21, 28]);
    });

    it("should select multiple indices starting from the current index after removing an index from the list of selected indices", () => {
      const [nextSelectedIndex, nextSelectedIndices] = select(
        selectedIndices,
        selectedIndex,
        14
      );
      expect(nextSelectedIndices).toEqual([0, 7, 21, 28]);

      selectedIndices = selectAll({
        selectedIds: nextSelectedIndices,
        selectedId: nextSelectedIndex,
        ids: indices,
        id: 35,
      });
      expect(selectedIndices).toEqual([0, 7, 21, 28, 35]);
    });

    it("should select multiple indices starting from the next selected index after removing current selected index", () => {
      let [nextIndex, nextIndices] = select(selectedIndices, selectedIndex, 28);
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 28);
      expect(nextIndices).toEqual([0, 7, 14, 21, 28]);

      selectedIndices = selectAll({
        selectedIds: nextIndices,
        selectedId: nextIndex,
        ids: indices,
        id: 35,
      });
      expect(selectedIndices).toEqual([28, 35]);
    });

    it("should select multiple indices starting from the previous selected index after removing current selected index", () => {
      // remove a single index
      let [nextIndex, nextIndices] = select(selectedIndices, selectedIndex, 14);
      expect(nextIndices).toEqual([0, 7, 21, 28]);

      // remove the currently selected index
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 28);
      [nextIndex, nextIndices] = select(nextIndices, nextIndex, 28);
      expect(nextIndices).toEqual([0, 7, 21, 28]);

      selectedIndices = selectAll({
        selectedIds: nextIndices,
        selectedId: nextIndex,
        ids: indices,
        id: 42,
      });
      expect(selectedIndices).toEqual([0, 7, 28, 35, 42]);
    });

    it("should select indices starting from the last selected index", () => {
      const [nextSelectedIndex, nextSelectedIndices] = select(
        selectedIndices,
        selectedIndex,
        14
      );
      expect(nextSelectedIndices).toEqual([0, 7, 21, 28]);

      selectedIndices = selectAll({
        selectedIds: nextSelectedIndices,
        selectedId: nextSelectedIndex,
        ids: indices,
        id: 14,
      });

      expect(selectedIndices).toEqual([14, 21]);
    });
  });

  it("should extend with a non-consecutive set", () => {
    indices = indices.map((x) => x * 7).reverse();
    selectedIndex = 42;
    selectedIndices = [42];

    selectedIndices = selectAll({
      selectedIds: selectedIndices,
      selectedId: selectedIndex,
      ids: indices,
      id: 28,
    });
    let [nextIndex, nextIndices] = select(selectedIndices, selectedIndex, 35);

    selectedIndices = selectAll({
      selectedIds: nextIndices,
      selectedId: nextIndex,
      ids: indices,
      id: 14,
    });

    expect(selectedIndices).toEqual([42, 28, 21, 14]);
  });
});
