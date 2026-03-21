import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SortableList } from "@/components/editor/SortableList";

describe("SortableList", () => {
  it("아이템 개수만큼 children을 렌더링한다", () => {
    const items = [
      { id: "1", label: "A" },
      { id: "2", label: "B" },
    ];
    render(
      <SortableList items={items} onReorder={vi.fn()}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.label}</div>}
      </SortableList>
    );
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
  });

  it("아이템이 없으면 빈 상태를 렌더링한다", () => {
    const { container } = render(
      <SortableList items={[]} onReorder={vi.fn()}>
        {(item: { id: string }) => <div>{item.id}</div>}
      </SortableList>
    );
    expect(container.querySelectorAll("[data-testid]")).toHaveLength(0);
  });
});
