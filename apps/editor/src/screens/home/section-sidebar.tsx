import cx from 'classnames'
import * as React from 'react'

import {Icon, IconifyIcon} from '@iconify/react'
import {useConnections, useTables} from 'app/use-store'

import connectionIcon from '@iconify/icons-mdi/connection'
import tableIcon from '@iconify/icons-mdi/table'
import refreshIcon from '@iconify/icons-icon-park-outline/refresh'
import copyIcon from '@iconify/icons-icon-park-outline/copy'
import snapshotIcon from '@iconify/icons-icon-park-outline/copy-link'
import removeCircleOutline from '@iconify/icons-ion/remove-circle-outline'
import downloadIcon from '@iconify/icons-mdi/download'
import linkPlus from '@iconify/icons-mdi/link-plus'
import databasePlus from '@iconify/icons-mdi/database-plus'
import uploadIcon from '@iconify/icons-mdi/upload'
import renameBox from '@iconify/icons-mdi/rename-box'

export function SectionSidebar(props: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <aside className={cx('flex gap-2', props.className)}>
      <BlockMenuSidebar />
      {props.children}
    </aside>
  )
}

function BlockMenuSidebar() {
  return (
    <nav className="bg-base-200 space-y-4 rounded-xl p-4 text-sm">
      <BlockMenuConnections />
      <BlockMenuTables />
      <BlockMenuQueries />
    </nav>
  )
}

function BlockMenuConnections() {
  const fromConnections = useConnections()

  const actions = (
    <div>
      <ButtonAction icon={linkPlus} tooltip="+ empty" />
      <ButtonAction icon={databasePlus} tooltip="+ url" />
      <ButtonAction icon={uploadIcon} tooltip="upload" />
    </div>
  )

  return (
    <BlockMenu
      actions={actions}
      icon={<Icon icon={connectionIcon} />}
      title={`Connections`}
    >
      {fromConnections.connections.map((conn) => {
        const active = fromConnections.selectedConnection === conn.name

        return (
          <BlockMenuItem
            key={conn.name}
            className="group justify-between gap-2"
            active={active}
            label={conn.name}
            onClick={fromConnections.run.connect}
          >
            <div
              className={cx(`group-hover:opacity-100`, {
                'opacity-0': !active,
              })}
            >
              <ButtonAction
                icon={refreshIcon}
                tooltip="refresh"
                onClick={fromConnections.run.reconnect}
              />
              <ButtonAction icon={renameBox} tooltip="rename" />
              <ButtonAction icon={copyIcon} tooltip="copy" />
              <ButtonAction icon={snapshotIcon} tooltip="snapshot" />
              <ButtonAction
                icon={downloadIcon}
                tooltip="download"
                onClick={fromConnections.run.download}
              />
              <ButtonAction
                icon={removeCircleOutline}
                tooltip="remove (twice click)"
              />
            </div>
          </BlockMenuItem>
        )
      })}
    </BlockMenu>
  )
}

function ButtonAction(props: {
  tooltip?: string
  icon: IconifyIcon | string
  onClick?: () => void
}) {
  return (
    <div className="tooltip tooltip-bottom" data-tip={props.tooltip}>
      <button className="btn btn-ghost btn-xs" onClick={props.onClick}>
        <Icon icon={props.icon} />
      </button>
    </div>
  )
}

function BlockMenuTables() {
  const fromTables = useTables()

  return (
    <BlockMenu icon={<Icon icon={tableIcon} />} title={`Tables`}>
      {fromTables.tables.map((table) => (
        <BlockMenuItem
          key={table.name}
          active={fromTables.selectedTable === table.name}
          label={table.name}
          onClick={fromTables.run.tableOpen}
        />
      ))}
    </BlockMenu>
  )
}

function BlockMenuQueries() {
  return (
    <BlockMenu icon={<Icon icon={tableIcon} />} title={`Queries`}></BlockMenu>
  )
}

function BlockMenu(props: {
  actions?: React.ReactNode
  icon: React.ReactNode
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="group flex justify-between">
        <h2 className="flex select-none items-center gap-2 text-sm font-semibold uppercase tracking-widest">
          {props.icon}
          {props.title}
        </h2>
        {props.actions}
      </div>
      <div className="flex flex-col space-y-1">{props.children}</div>
    </div>
  )
}

function BlockMenuItem(props: {
  active?: boolean
  className?: string
  children?: React.ReactNode
  label: string
  onClick?: (label: string) => void
}) {
  return (
    <div className={cx(`flex`, props.className)}>
      <div
        className={cx(
          {'bg-primary': props.active},
          'btn btn-ghost btn-xs justify-start',
        )}
        onClick={() => props.onClick?.(props.label)}
      >
        {props.label}
      </div>
      {props.children}
    </div>
  )
}
