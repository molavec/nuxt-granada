export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'section'

export interface Block {
  id: string
  type: BlockType
  _version: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>
  children: Block[]
}

export interface EditorState {
  blocks: Block[]
  selectedBlockId: string | null
  isDirty: boolean
  viewportMode: 'desktop' | 'tablet' | 'mobile'
  rightSidebarTab: 'layers' | 'properties'
}
