export type SceneCell = EmptyCell | SolidCell | SandCell;

export type EmptyCell = 1;
export type SolidCell = 2;
export type SandCell = 3;

export type Scene = SceneCell[][];

export function initScene(width: number): Scene {
    return Array(width)
        .fill(0)
        .map((_, i) =>
            Array(width)
                .fill(0)
                .map(() => getCell(i, width)),
        );
}

function getCell(index: number, width: number) {
    const emptyCell: EmptyCell = 1;
    const solidCell: SolidCell = 2;

    if (index < 100 && Math.random() < 0.8) {
        return solidCell;
    }

    if (index > width / 2) {
        return emptyCell;
    }

    const cells: SceneCell[] = [1, 3];
    const cell = cells[Math.floor(Math.random() * cells.length)];

    return cell;
}
