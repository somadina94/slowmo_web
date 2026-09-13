import { render, screen } from "@testing-library/react";
import { PendingIcon } from "./PendingIcon";
import { ConsultUploadBody, ConsultUploadMeta } from "../pages/preorder/ConsultUpload";

test("pending icon and consult upload views", () => {
  const { rerender } = render(<PendingIcon pending={false} />);
  expect(screen.queryByLabelText("Loading")).not.toBeInTheDocument();
  rerender(<PendingIcon pending={true} />);
  expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  rerender(<ConsultUploadBody pending preview="" name="" type="" />);
  expect(screen.getByText("Uploading…")).toBeInTheDocument();
  rerender(<ConsultUploadBody pending={false} preview="blob:x" name="" type="image/png" />);
  expect(screen.getByAltText("Prescription preview")).toBeInTheDocument();
  rerender(<ConsultUploadBody pending={false} preview="blob:x" name="rx.png" type="image/png" />);
  expect(screen.getByAltText("rx.png")).toBeInTheDocument();
  rerender(<ConsultUploadBody pending={false} preview="" name="" type="" />);
  expect(screen.getByText(/Drag and drop/)).toBeInTheDocument();
  rerender(<ConsultUploadBody pending={false} preview="" name="rx.pdf" type="application/pdf" />);
  expect(screen.getByText("rx.pdf")).toBeInTheDocument();
  rerender(<ConsultUploadMeta pending name="rx.pdf" type="application/pdf" />);
  expect(screen.queryByText(/PDF ready/)).not.toBeInTheDocument();
  rerender(<ConsultUploadMeta pending={false} name="" type="" />);
  expect(screen.queryByText(/PDF ready/)).not.toBeInTheDocument();
  rerender(<ConsultUploadMeta pending={false} name="rx.pdf" type="application/pdf" />);
  expect(screen.getByText(/PDF ready/)).toBeInTheDocument();
  rerender(<ConsultUploadMeta pending={false} name="rx.png" type="image/png" />);
  expect(screen.getByText("rx.png")).toBeInTheDocument();
});
