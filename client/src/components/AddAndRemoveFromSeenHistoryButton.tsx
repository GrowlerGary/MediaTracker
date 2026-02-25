import React, { FunctionComponent } from 'react';
import { plural, Trans } from '@lingui/macro';
import clsx from 'clsx';

import {
  MediaItemDetailsResponse,
  MediaItemItemsResponse,
  TvEpisode,
  TvSeason,
} from 'mediatracker-api';
import {
  formatEpisodeNumber,
  formatSeasonNumber,
  isAudiobook,
  isBook,
  isMovie,
  isTvShow,
  isVideoGame,
} from 'src/utils';
import { Modal } from 'src/components/Modal';
import { SelectSeenDate } from 'src/components/SelectSeenDate';
import { markAsUnseen } from 'src/api/details';
import { Confirm } from 'src/components/Confirm';

export const AddToSeenHistoryButton: FunctionComponent<{
  mediaItem: MediaItemItemsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
  useSeasonAndEpisodeNumber?: boolean;
  className?: string;
}> = (props) => {
  const { mediaItem, season, episode, useSeasonAndEpisodeNumber, className } = {
    useSeasonAndEpisodeNumber: false,
    ...props,
  };

  const buttonContent = () => {
    if (isAudiobook(mediaItem)) return <Trans>Add to listened history</Trans>;
    if (isBook(mediaItem)) return <Trans>Add to read history</Trans>;
    if (isVideoGame(mediaItem)) return <Trans>Add to played history</Trans>;
    if (isMovie(mediaItem)) return <Trans>Add to seen history</Trans>;
    if (isTvShow(mediaItem)) {
      if (useSeasonAndEpisodeNumber) {
        if (episode) return <Trans>Add {formatEpisodeNumber(episode)} to seen history</Trans>;
        if (season) return <Trans>Add {formatSeasonNumber(season)} to seen history</Trans>;
      }
      if (episode) return <Trans>Add episode to seen history</Trans>;
      if (season) return <Trans>Add season to seen history</Trans>;
    }
    return <Trans>Add to seen history</Trans>;
  };

  return (
    <Modal
      openModal={(openModal) => (
        <button
          onClick={openModal}
          className={clsx(
            'btn-success',
            className
          )}
        >
          <span className="material-icons">check_circle</span>
          {buttonContent()}
        </button>
      )}
    >
      {(closeModal) => (
        <SelectSeenDate
          mediaItem={mediaItem}
          season={season}
          episode={episode}
          closeModal={closeModal}
        />
      )}
    </Modal>
  );
};

export const RemoveFromSeenHistoryButton: FunctionComponent<{
  mediaItem: MediaItemDetailsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
  seenId?: number;
  className?: string;
}> = (props) => {
  const { mediaItem, season, episode, seenId, className } = props;

  const seasonEpisodesIdSet = new Set(
    season?.episodes?.map((episode) => episode.id)
  );

  const count =
    seenId !== undefined
      ? 1
      : episode
      ? mediaItem.seenHistory?.filter(
          (entry) => entry.episodeId === episode?.id
        ).length
      : season
      ? mediaItem.seenHistory?.filter((entry) =
          seasonEpisodesIdSet.has(entry.episodeId)
        ).length
      : mediaItem.seenHistory?.length;

  const buttonContent = () => {
    if (isAudiobook(mediaItem)) return <Trans>Remove from listened history</Trans>;
    if (isBook(mediaItem)) return <Trans>Remove from read history</Trans>;
    if (isVideoGame(mediaItem)) return <Trans>Remove from played history</Trans>;
    if (isMovie(mediaItem)) return <Trans>Remove from seen history</Trans>;
    if (isTvShow(mediaItem)) {
      if (episode) return <Trans>Remove episode from seen history</Trans>;
      if (season) return <Trans>Remove season from seen history</Trans>;
    }
    return <Trans>Remove from seen history</Trans>;
  };

  return (
    <button
      className={clsx('btn-danger', className)}
      onClick={async () => {
        const confirmed = await Confirm(
          plural(count, {
            one: 'Do you want to remove # seen history entry?',
            other: 'Do you want to remove all # seen history entries?',
          })
        );
        if (confirmed) {
          markAsUnseen({
            mediaItem,
            season,
            episode,
            seenId,
          });
        }
      }}
    >
      <span className="material-icons">remove_circle</span>
      {buttonContent()}
    </button>
  );
};

export default AddToSeenHistoryButton;
