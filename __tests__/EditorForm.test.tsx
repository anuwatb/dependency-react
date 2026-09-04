import "@testing-library/react/dont-cleanup-after-each";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditorForm from "@/components/EditorForm";

describe('EditorForm Buttons', () => {
    afterAll(() => {
        cleanup();
    });

    test('add button should add nodes and links correctly', async () => {
        render(<EditorForm />);
        
        const nodeNameInput = screen.getByRole('textbox', { name: /^name$/i });
        const depsInput = screen.getByRole('textbox', { name: /^dependencies$/i });
        const addButton = screen.getByRole('button', { name: /^add$/i });

        await userEvent.type(nodeNameInput, 'c');
        await userEvent.type(depsInput, 'a,b');
        await userEvent.click(addButton);

        const svg = await screen.findByTestId('svg');

        const svgData = JSON.parse(svg.dataset.testdata!);
        expect(svgData.nodes).toHaveLength(3);
        expect(svgData.nodes).toContainEqual({ name: "a", category: "Default", deps: [], fullname: "", details: "" });
        expect(svgData.nodes).toContainEqual({ name: "b", category: "Default", deps: [], fullname: "", details: "" });
        expect(svgData.nodes).toContainEqual({ name: "c", category: "Default", deps: ["a", "b"], fullname: "", details: "" });
        expect(svgData.links).toHaveLength(2);
        expect(svgData.links).toContainEqual({ source: "a", target: "c", value: 1 });
        expect(svgData.links).toContainEqual({ source: "b", target: "c", value: 1 });

        // const nodeTexts = await screen.findAllByTestId(/node-text-\w*/);
        // const nodeTextA = await screen.findByTestId('node-text-a');
        // const nodeTextB = await screen.findByTestId('node-text-b');
        // const nodeTextC = await screen.findByTestId('node-text-c');
        // const links = await screen.findAllByTestId(/link-\w*-\w*/);
        // const linkAC = await screen.findByTestId('link-a-c');
        // const linkBC = await screen.findByTestId('link-b-c');

        // expect(nodeTexts).toHaveLength(3);
        // expect(nodeTexts).toContain(nodeTextA);
        // expect(nodeTexts).toContain(nodeTextB);
        // expect(nodeTexts).toContain(nodeTextC);
        // expect(links).toHaveLength(2);
        // expect(links).toContain(linkAC);
        // expect(links).toContain(linkBC);
    });

    test('edit button should edit the selected node\'s name', async () => {
        const nodeNameInput = screen.getByRole('textbox', { name: /^name$/i });
        const nodeC = screen.getByTestId('node-c');

        await userEvent.click(nodeC);
        await userEvent.clear(nodeNameInput);
        await userEvent.type(nodeNameInput, 'd');
        const editButton = await screen.findByRole('button', { name: /^edit$/i });
        await userEvent.click(editButton);

        const svg = await screen.findByTestId('svg');

        const svgData = JSON.parse(svg.dataset.testdata!);
        expect(svgData.nodes).toHaveLength(3);
        expect(svgData.nodes).toContainEqual({ name: "a", category: "Default", deps: [], fullname: "", details: "" });
        expect(svgData.nodes).toContainEqual({ name: "b", category: "Default", deps: [], fullname: "", details: "" });
        expect(svgData.nodes).toContainEqual({ name: "d", category: "Default", deps: ["a", "b"], fullname: "", details: "" });
        expect(svgData.links).toHaveLength(2);
        expect(svgData.links).toContainEqual({ source: "a", target: "d", value: 1 });
        expect(svgData.links).toContainEqual({ source: "b", target: "d", value: 1 });
    });

    test('delete button should delete the selected node', async () => {
        const nodeB = screen.getByTestId('node-b');

        await userEvent.click(nodeB);
        const deleteButton = await screen.findByRole('button', { name: /^delete$/i });
        await userEvent.click(deleteButton);

        const svg = await screen.findByTestId('svg');

        const svgData = JSON.parse(svg.dataset.testdata!);
        expect(svgData.nodes).toHaveLength(2);
        expect(svgData.nodes).toContainEqual({ name: "a", category: "Default", deps: [], fullname: "", details: "" });
        expect(svgData.nodes).toContainEqual({ name: "d", category: "Default", deps: ["a"], fullname: "", details: "" });
        expect(svgData.links).toHaveLength(1);
        expect(svgData.links).toContainEqual({ source: "a", target: "d", value: 1 });
    });
});