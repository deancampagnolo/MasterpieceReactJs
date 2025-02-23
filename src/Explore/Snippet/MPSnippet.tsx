import * as React from 'react'
import { useState } from 'react'

import Typography from '@mui/material/Typography'
import {
    Mic,
    Remove,
    VolumeOff,
    VolumeUp
} from '@mui/icons-material'
import { Box, Divider, IconButton, Input, Theme, useMediaQuery } from '@mui/material'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import VolumeSlider from '../../SharedComponenets/VolumeSlider'
import { NudgeType } from '../../Utils/AudioControllerModel'
import NudgeBox from '../../SharedComponenets/NudgeBox'

interface MPSnippetProps {
    title: string
    onRemove: () => void
    onMute: () => void
    onSolo: () => void
    onVolumeChange: (dbs: number) => void
    onSnippetTitleChange: (title: string) => void
    initialVolume: number
    onNudge: (nudge: NudgeType) => void
}

export default function MPSnippet (props: MPSnippetProps): ReactJSXElement {
    const [isVisuallyMuted, setIsVisuallyMuted] = useState(false)

    const onVolumeSliderChange = (dbs: number): void => {
        props.onVolumeChange(dbs)
        setIsVisuallyMuted(false)
    }

    return (
        <Box bgcolor="secondary.main" style={{ width: '100%', borderRadius: '6px', marginTop: '4px', marginBottom: '4px' }}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                <LeftPortion isVisuallyMuted={isVisuallyMuted} setIsVisuallyMuted={setIsVisuallyMuted} onMute={props.onMute} onSolo={props.onSolo} style={{ flex: 1 }}/>
                <Divider orientation="vertical" flexItem variant="middle" sx={{ margin: '10px' }}/>
                <Box display="flex" flexDirection="column" style={{ flex: 11 }}>
                    <TopPortion defaultTitle={props.title} onSnippetTitleChange={props.onSnippetTitleChange}/>
                    <Divider flexItem variant="middle"/>
                    <BottomPortion onVolumeSliderChange={onVolumeSliderChange} initialVolume={props.initialVolume} onNudge={props.onNudge}/>
                </Box>
                <Divider orientation="vertical" flexItem variant="middle" sx={{ margin: '10px' }}/>
                <RightPortion onRemove={() => { props.onRemove() }} style={{ flex: 1 }}/>
            </Box>
        </Box>
    )
}

interface LeftPortionProps {
    onMute: () => void
    onSolo: () => void
    setIsVisuallyMuted: React.Dispatch<React.SetStateAction<boolean>>
    isVisuallyMuted: boolean
    style?: React.CSSProperties
}

function LeftPortion (props: LeftPortionProps): ReactJSXElement {
    const onMuteClicked = (): void => {
        props.setIsVisuallyMuted(!props.isVisuallyMuted)
        props.onMute()
    }
    return (
        <Box display="flex" flexDirection="row" alignItems="center" style={props.style}>
            <IconButton size="small" onClick={onMuteClicked}>
                {props.isVisuallyMuted ? <VolumeOff/> : <VolumeUp/>}
            </IconButton>
            <IconButton size="small" onClick={props.onSolo}>
                <Mic/>
            </IconButton>
        </Box>
    )
}

interface RightPortionProps {
    onRemove: () => void
    style?: React.CSSProperties
}

function RightPortion (props: RightPortionProps): ReactJSXElement {
    return (
        <IconButton size="small" onClick={() => { props.onRemove() }} style={props.style}>
            <Remove/>
        </IconButton>
    )
}

interface TopPortionProps {
    defaultTitle: string
    onSnippetTitleChange: (title: string) => void
}

function TopPortion (props: TopPortionProps): ReactJSXElement {
    const [title, setTitle] = useState(props.defaultTitle)

    const onSnippetTitleChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const title = e.target.value
        setTitle(title)
        props.onSnippetTitleChange(title)
    }

    return (
        <Input type="text" defaultValue={title} onChange={onSnippetTitleChangeEvent} disableUnderline={true} style={{ background: 'none', border: 'none', flex: 10 }}/>
    )
}

interface BottomPortionProps {
    onVolumeSliderChange: (dbs: number) => void
    initialVolume: number
    onNudge: (nudge: NudgeType) => void
}

function BottomPortion (props: BottomPortionProps): ReactJSXElement {
    const shouldStack = useMediaQuery((theme: Theme) => `${theme.breakpoints.down('md')} or (orientation: portrait)`)
    const onVolumeSliderChange = (e: Event, value: number | number[]): void => {
        if (typeof (value) === 'number') {
            props.onVolumeSliderChange(value)
        }
    }
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" flexDirection="row" alignItems="center" width="100%">
                <Typography>
                Volume
                </Typography>
                <VolumeSlider onVolumeSliderChange={onVolumeSliderChange} defaultValue={props.initialVolume}
                    style={{ marginLeft: '20px', marginRight: '20px', width: '30%' }}/>
                {!shouldStack &&
                <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                    <Divider orientation="vertical" flexItem variant="middle" sx={{ margin: '10px' }}/>
                    <NudgeBox onNudge={props.onNudge}/>
                </div>
                }
            </Box>
            {shouldStack &&
                <div style={{ width: '100%' }}>
                    <Divider flexItem variant="middle"/>
                    <NudgeBox onNudge={props.onNudge}/>
                </div>
            }
        </Box>
    )
}
