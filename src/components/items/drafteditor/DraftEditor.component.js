import React from "react";
import { Form } from "react-bootstrap";

const DraftEditor = () => {
    return (
        <div id="draftEditor">
            <Form.Group>
                <Form.Control
                    required
                    as="textarea"
                    rows={5}
                    placeholder="Write news"
                ></Form.Control>
            </Form.Group>
        </div>
    );
};

export default DraftEditor;
