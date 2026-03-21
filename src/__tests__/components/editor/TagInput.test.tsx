import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "@/components/editor/TagInput";

describe("TagInput", () => {
  it("전달된 태그들을 렌더링한다", () => {
    render(<TagInput tags={["React", "TypeScript"]} onChange={() => {}} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("태그가 없으면 placeholder를 표시한다", () => {
    render(<TagInput tags={[]} onChange={() => {}} placeholder="기술 입력" />);
    expect(screen.getByPlaceholderText("기술 입력")).toBeInTheDocument();
  });

  it("태그가 있으면 placeholder를 숨긴다", () => {
    render(<TagInput tags={["React"]} onChange={() => {}} placeholder="기술 입력" />);
    expect(screen.queryByPlaceholderText("기술 입력")).not.toBeInTheDocument();
  });

  it("Enter를 누르면 태그가 추가된다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "React{enter}");
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });

  it("중복 태그는 추가되지 않는다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={["React"]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "React{enter}");
    // 중복이므로 onChange가 호출되지 않아야 하지만,
    // addTag는 항상 setInput("")을 호출하므로 onChange는 호출되지 않음
    expect(onChange).not.toHaveBeenCalled();
  });

  it("빈 입력은 추가되지 않는다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("공백만 있는 입력은 추가되지 않는다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "   {enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Backspace로 마지막 태그를 삭제할 수 있다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={["React", "Vue"]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });

  it("입력값이 있으면 Backspace로 태그가 삭제되지 않는다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={["React"]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "ab{Backspace}");
    // Backspace는 입력값 "a"를 지울 뿐, 태그를 삭제하지 않음
    expect(onChange).not.toHaveBeenCalled();
  });

  it("삭제 버튼으로 특정 태그를 삭제할 수 있다", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={["React", "Vue", "Angular"]} onChange={onChange} />);

    const deleteButtons = screen.getAllByRole("button", { name: "태그 삭제" });
    await user.click(deleteButtons[1]); // Vue 삭제
    expect(onChange).toHaveBeenCalledWith(["React", "Angular"]);
  });

  it("기본 placeholder는 '입력 후 Enter'이다", () => {
    render(<TagInput tags={[]} onChange={() => {}} />);
    expect(screen.getByPlaceholderText("입력 후 Enter")).toBeInTheDocument();
  });
});
